import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import { useState } from "react";

interface AdminTokenDialogProps {
  open: boolean;
  onConfirm: (token: string) => void;
  onSkip: () => void;
}

export default function AdminTokenDialog({
  open,
  onConfirm,
  onSkip,
}: AdminTokenDialogProps) {
  const [token, setToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(token.trim());
    setToken("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onSkip();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-muted-foreground" />
            <DialogTitle>Admin Access</DialogTitle>
          </div>
          <DialogDescription>
            Enter your admin token to get upload access. Skip if you're not an
            admin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <Input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoFocus
            data-ocid="admin_token_dialog.input"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-foreground text-white hover:opacity-90"
              data-ocid="admin_token_dialog.confirm_button"
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSkip}
              data-ocid="admin_token_dialog.skip_button"
            >
              Skip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
