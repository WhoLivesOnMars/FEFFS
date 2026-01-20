import {NewsReadOneScreen} from "@/src/features/news/NewsReadOneScreen";
import {useLocalSearchParams} from "expo-router";

export default function ReadOne() {
    const { id } = useLocalSearchParams();
    return <NewsReadOneScreen news_id={Number(id)} />;
}