"use client";
import FlowDialog from "./FlowDialog";
import RegistrationList from "./RegistrationList";
export default function Enigma2MyPassesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; onExploreEvents?: () => void }) {
 return isOpen ? <FlowDialog title="My registrations" onClose={onClose}><RegistrationList /></FlowDialog> : null;
}
