import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "./workspace";
import { Button } from "@/components/ui/button";
import { UserPlus, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
export function JoinOrganization() {
  const { refresh } = useWorkspace();
  const [code, setCode] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function join(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.rpc("roomly_join", { code: code.trim() });
    if (error) setError(error.message);
    else await refresh();
    setBusy(false);
  }
  return (
    <section className="settings-section">
      <h2>Masz zaproszenie od zespołu?</h2>
      <form className="auth-form" onSubmit={join}>
        <div className="field">
          <label htmlFor="invite-code">Kod zaproszenia</label>
          <input
            id="invite-code"
            value={code}
            required
            onChange={(e) => setCode(e.target.value)}
            placeholder="Wklej kod od administratora"
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div>
          <Button variant="outline" type="submit" disabled={busy}>
            Dołącz do organizacji
            <ArrowRight />
          </Button>
        </div>
      </form>
    </section>
  );
}
export function InviteEmployee() {
  const { workspace, live } = useWorkspace();
  const [code, setCode] = useState(""),
    [busy, setBusy] = useState(false);
  async function invite() {
    if (!workspace.organization) return;
    if (!live) {
      toast.info("Zapraszanie pracowników jest dostępne po zalogowaniu do prawdziwej organizacji.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.rpc("roomly_invite", { org: workspace.organization.id });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCode(String(data));
  }
  return (
    <div className="my-5">
      <Button variant="outline" disabled={busy} onClick={invite}>
        <UserPlus />
        {busy ? "Tworzenie kodu…" : "Zaproś pracownika"}
      </Button>
      {code && (
        <div className="mt-4">
          <div className="field">
            <label htmlFor="generated-invite">Jednorazowy kod · ważny 7 dni</label>
            <div className="flex gap-2">
              <input id="generated-invite" readOnly value={code} />
              <Button
                variant="outline"
                size="icon"
                aria-label="Skopiuj kod zaproszenia"
                onClick={() =>
                  navigator.clipboard
                    .writeText(code)
                    .then(() => toast.success("Kod skopiowany."))
                    .catch(() => toast.error("Zaznacz i skopiuj kod z pola."))
                }
              >
                <Copy />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
