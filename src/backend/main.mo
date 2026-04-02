import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Comment {
    public func compare(c1 : Comment, c2 : Comment) : Order.Order {
      Int.compare(c1.timestamp, c2.timestamp);
    };
  };

  module Wallpaper {
    public func compare(w1 : Wallpaper, w2 : Wallpaper) : Order.Order {
      Int.compare(w2.uploadedAt, w1.uploadedAt);
    };
  };

  public type Comment = {
    author : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type Wallpaper = {
    id : Text;
    title : Text;
    externalBlob : Storage.ExternalBlob;
    category : Text;
    likes : Nat;
    downloads : Nat;
    comments : [Comment];
    uploadedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let wallpapers = Map.empty<Text, Wallpaper>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be signed in to save a profile");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: Add a new wallpaper
  public shared ({ caller }) func addWallpaper(id : Text, title : Text, category : Text, externalBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add wallpapers");
    };
    let newWallpaper : Wallpaper = {
      id;
      title;
      externalBlob;
      category;
      likes = 0;
      downloads = 0;
      comments = [];
      uploadedAt = Time.now();
    };
    wallpapers.add(id, newWallpaper);
  };

  // Admin-only: Delete a wallpaper
  public shared ({ caller }) func deleteWallpaper(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete wallpapers");
    };
    wallpapers.remove(id);
  };

  // Public: Get a single wallpaper by id
  public query ({ caller }) func getWallpaper(id : Text) : async ?Wallpaper {
    wallpapers.get(id);
  };

  // Public: Get all wallpapers sorted by newest first
  public query ({ caller }) func getAllWallpapers() : async [Wallpaper] {
    wallpapers.values().toArray().sort();
  };

  // Public: Like a wallpaper
  public shared ({ caller }) func likeWallpaper(id : Text) : async () {
    switch (wallpapers.get(id)) {
      case (null) {
        Runtime.trap("Wallpaper not found");
      };
      case (?wallpaper) {
        let updated : Wallpaper = {
          wallpaper with
          likes = wallpaper.likes + 1;
        };
        wallpapers.add(id, updated);
      };
    };
  };

  // Public: Record a download
  public shared ({ caller }) func downloadWallpaper(id : Text) : async () {
    switch (wallpapers.get(id)) {
      case (null) {
        Runtime.trap("Wallpaper not found");
      };
      case (?wallpaper) {
        let updated : Wallpaper = {
          wallpaper with
          downloads = wallpaper.downloads + 1;
        };
        wallpapers.add(id, updated);
      };
    };
  };

  // Public: Add a comment to a wallpaper
  public shared ({ caller }) func addComment(id : Text, author : Text, text : Text) : async () {
    let newComment : Comment = {
      author;
      text;
      timestamp = Time.now();
    };

    switch (wallpapers.get(id)) {
      case (null) {
        Runtime.trap("Wallpaper not found");
      };
      case (?wallpaper) {
        let commentsList = List.fromArray<Comment>(wallpaper.comments);
        commentsList.add(newComment);
        let updated : Wallpaper = {
          wallpaper with
          comments = commentsList.values().toArray();
        };
        wallpapers.add(id, updated);
      };
    };
  };
};
