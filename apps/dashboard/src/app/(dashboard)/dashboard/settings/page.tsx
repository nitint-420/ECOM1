"use client";
import { useState, useEffect } from "react";
import { Button, Card, CardContent, Input } from "@ecom/ui";
import { Store, Phone, Mail, MapPin, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [s, setS] = useState({ store_name: "", store_phone: "", store_whatsapp: "", store_email: "", store_address: "", store_timing: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.settings) { const m: any = {}; d.settings.forEach((x: any) => { m[x.key] = x.value; }); setS(p => ({...p, ...m})); }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: s }) });
      if (!res.ok) throw new Error();
      toast.success("Saved!");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card><CardContent className="p-6 space-y-4">
        <Input label="Store Name" icon={<Store className="h-4 w-4" />} value={s.store_name} onChange={(e) => setS({...s, store_name: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone" icon={<Phone className="h-4 w-4" />} value={s.store_phone} onChange={(e) => setS({...s, store_phone: e.target.value})} />
          <Input label="WhatsApp" icon={<Phone className="h-4 w-4" />} value={s.store_whatsapp} onChange={(e) => setS({...s, store_whatsapp: e.target.value})} />
        </div>
        <Input label="Email" icon={<Mail className="h-4 w-4" />} value={s.store_email} onChange={(e) => setS({...s, store_email: e.target.value})} />
        <Input label="Address" icon={<MapPin className="h-4 w-4" />} value={s.store_address} onChange={(e) => setS({...s, store_address: e.target.value})} />
        <Input label="Timing" placeholder="8 AM - 10 PM" value={s.store_timing} onChange={(e) => setS({...s, store_timing: e.target.value})} />
        <Button onClick={save} loading={saving} className="w-full"><Save className="h-4 w-4 mr-2" />Save Settings</Button>
      </CardContent></Card>
    </div>
  );
}
