import {Ionicons} from "@expo/vector-icons";

export interface I_News {
    id: number,
    name: string,
    chapo: string,
    thumbnail_image_url: string,
    banner_image_url: string,
    published_at: string,
    tags: string[],
    paragraphs: string[],
    cta: {
        icon: keyof typeof Ionicons.glyphMap,
        label: string
    }
}