import { MessageCircle } from "lucide-react";
import { business, whatsappLink } from "@/config/business";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(
        `Hello ${business.name}, I would like to enquire about your appliance services.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Cool Air on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-whatsapp-foreground shadow-lift transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:bottom-8 md:right-8"
    >
      <MessageCircle className="size-6" />
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
