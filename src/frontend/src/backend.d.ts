import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Wallpaper {
    id: string;
    title: string;
    externalBlob: ExternalBlob;
    likes: bigint;
    category: string;
    comments: Array<Comment>;
    uploadedAt: Time;
    downloads: bigint;
}
export type Time = bigint;
export interface Comment {
    text: string;
    author: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    registerCaller(): Promise<void>;
    addComment(id: string, author: string, text: string): Promise<void>;
    addWallpaper(id: string, title: string, category: string, externalBlob: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteWallpaper(id: string): Promise<void>;
    downloadWallpaper(id: string): Promise<void>;
    getAllWallpapers(): Promise<Array<Wallpaper>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWallpaper(id: string): Promise<Wallpaper | null>;
    isCallerAdmin(): Promise<boolean>;
    likeWallpaper(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
}
