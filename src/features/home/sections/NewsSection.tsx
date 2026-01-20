import {Component} from "react";
import {View, Text, ScrollView} from "react-native";
import tw from "twrnc";
import {Link} from "expo-router";
import {NewsCard} from "@/src/components/news/NewsCard";

export class NewsSection extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={tw`my-4`}>
                <View style={tw`flex flex-row justify-between mx-6`}>
                    <Text style={tw`text-orange-500 font-extrabold uppercase mb-4`}>Actualités</Text>
                    <Link href="/(news)">Toutes les actualités</Link>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={tw`justify-between items-center gap-4 px-6`} style={tw` bg-gray-800 w-full h-50`}>
                    <NewsCard source={{ uri: 'https://picsum.photos/200' }} title='À vos candidatures !' chapo="Jusqu'au 20 Février 2026." />
                    <NewsCard source={{ uri: 'https://picsum.photos/200' }} title='À vos candidatures !' chapo="Jusqu'au 20 Février 2026." />
                    <NewsCard source={{ uri: 'https://picsum.photos/200' }} title='À vos candidatures !' chapo="Jusqu'au 20 Février 2026." />
                    <NewsCard source={{ uri: 'https://picsum.photos/200' }} title='À vos candidatures !' chapo="Jusqu'au 20 Février 2026." />
                    <NewsCard source={{ uri: 'https://picsum.photos/200' }} title='À vos candidatures !' chapo="Jusqu'au 20 Février 2026." />
                </ScrollView>
            </View>
        );
    }
}