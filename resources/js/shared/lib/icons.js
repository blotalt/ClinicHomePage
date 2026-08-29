import {
    Activity,
    Apple,
    Baby,
    Bone,
    Brain,
    BriefcaseMedical,
    Clock,
    Dumbbell,
    Ear,
    Eye,
    Flower2,
    Handshake,
    HeartPulse,
    Heart,
    House,
    Leaf,
    Mail,
    MapPin,
    MessageCircleHeart,
    Microscope,
    Phone,
    Pill,
    ShieldCheck,
    Smile,
    Sparkles,
    Sprout,
    Stethoscope,
    Syringe,
    Thermometer,
    Users,
    Video,
} from 'lucide-react';

/**
 * Icons an admin can choose for a service, pillar or clinic detail.
 *
 * Only these are bundled, so adding a new option means adding it here — that
 * is deliberate: importing all of lucide would balloon the bundle.
 */
export const ICONS = {
    Activity,
    Apple,
    Baby,
    Bone,
    Brain,
    BriefcaseMedical,
    Clock,
    Dumbbell,
    Ear,
    Eye,
    Flower2,
    Handshake,
    Heart,
    HeartPulse,
    House,
    Leaf,
    Mail,
    MapPin,
    MessageCircleHeart,
    Microscope,
    Phone,
    Pill,
    ShieldCheck,
    Smile,
    Sparkles,
    Sprout,
    Stethoscope,
    Syringe,
    Thermometer,
    Users,
    Video,
};

/** Sorted names, for the admin's icon picker. */
export const ICON_NAMES = Object.keys(ICONS).sort();

/**
 * Resolve a stored icon name to a component, falling back to something
 * neutral so a typo in the admin never blanks out a page.
 */
export function resolveIcon(name) {
    return ICONS[name] ?? Sparkles;
}
