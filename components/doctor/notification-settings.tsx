"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EmergencyContact } from "@/lib/notification-service"

interface NotificationSettingsProps {
  patientId: string
  patientName: string
  initialContacts?: EmergencyContact[]
  onSave: (contacts: EmergencyContact[]) => void
  onClose: () => void
}

export function NotificationSettings({
  patientName,
  initialContacts = [],
  onSave,
  onClose,
}: NotificationSettingsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts)
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || "Contact",
      }
      setContacts([...contacts, contact])
      setNewContact({ name: "", phone: "", relationship: "" })
    }
  }

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    onSave(contacts)
    onClose()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Notification Settings</CardTitle>
        <p className="text-sm text-muted-foreground">Configure SMS alerts for {patientName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing contacts */}
        {contacts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Emergency Contacts</Label>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.phone} · {contact.relationship}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${contact.name}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new contact */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add New Contact</Label>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <Input
              placeholder="Phone (e.g., +880...)"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <Input
              placeholder="Relationship (e.g., Family, Doctor)"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            />
            <Button variant="outline" size="sm" onClick={handleAddContact} className="w-full bg-transparent">
              Add Contact
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
