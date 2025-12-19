"use client";

import { Phone, MessageCircle, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface CommunicationBarProps {
    phone?: string;
    email?: string;
    leadId?: number;
}

export default function CommunicationBar({
    phone,
    email,
    leadId,
}: CommunicationBarProps) {
    // Handle phone call
    const handleCall = async () => {
        if (!phone) return;

        // Log the call in backend
        if (leadId) {
            try {
                await api.post("/call-logs/quick-call", {
                    lead_id: leadId,
                    phone_number: phone,
                });
            } catch (error) {
                console.error("Error logging call:", error);
            }
        }

        // Open phone app
        window.location.href = `tel:${phone}`;
    };

    // Handle WhatsApp
    const handleWhatsApp = () => {
        if (!phone) return;
        const phoneNumber = phone.replace(/[^0-9]/g, "");
        const message = encodeURIComponent(
            "Hi! I'm reaching out regarding your inquiry. How can I help you today?"
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    // Handle SMS
    const handleSMS = () => {
        if (!phone) return;
        const message = encodeURIComponent(
            "Hi! This is a follow-up regarding your inquiry. Please let us know if you have any questions."
        );
        window.location.href = `sms:${phone}?body=${message}`;
    };

    // Handle Email
    const handleEmail = () => {
        if (!email) return;
        const subject = encodeURIComponent("Follow-up on your inquiry");
        const body = encodeURIComponent(
            "Hi,\n\nThank you for your interest. I wanted to follow up on your inquiry.\n\nPlease let me know if you have any questions.\n\nBest regards"
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-3">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {/* Call Button */}
                <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={handleCall}
                    disabled={!phone}
                >
                    <div className="p-2 rounded-full bg-emerald-500/20">
                        <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Call</span>
                </Button>

                {/* WhatsApp Button */}
                <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-green-400 hover:bg-green-500/10"
                    onClick={handleWhatsApp}
                    disabled={!phone}
                >
                    <div className="p-2 rounded-full bg-green-500/20">
                        <MessageCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs">WhatsApp</span>
                </Button>

                {/* SMS Button */}
                <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-blue-400 hover:bg-blue-500/10"
                    onClick={handleSMS}
                    disabled={!phone}
                >
                    <div className="p-2 rounded-full bg-blue-500/20">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <span className="text-xs">SMS</span>
                </Button>

                {/* Email Button */}
                <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-purple-400 hover:bg-purple-500/10"
                    onClick={handleEmail}
                    disabled={!email}
                >
                    <div className="p-2 rounded-full bg-purple-500/20">
                        <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-xs">Email</span>
                </Button>
            </div>
        </div>
    );
}
