import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp
} from "react-icons/fa";

export const contactInfo = [
  {
    id: 1,
    icon: FaEnvelope,
    title: "Email",
    value: "techmonsterx6@gmail.com",
    action: "https://mail.google.com/mail/?view=cm&fs=1&to=techmonsterx6@gmail.com"
  },
  {
    id: 2,
    icon: FaWhatsapp,
    title: "Whatsapp",
    value: "+91 8984457601",
    action: "https://wa.me/918984457601?text=Hello%20Tech%20Monster"
  },
  {
    id: 3,
    icon: FaMapMarkerAlt,
    title: "Address",
    value: "Bhubaneswar, Odisha",
    action: "https://www.google.com/maps/search/?api=1&query=Bhubaneswar+Odisha"
  }
];