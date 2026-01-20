import {Component} from "react";
import {View, Text, ScrollView, FlatList} from "react-native";
import tw from "twrnc";
import {Link} from "expo-router";
import {NewsCard} from "@/src/components/news/NewsCard";
import {I_News} from "@/src/interfaces/I_News";
import newsData from "@/assets/news.json";

interface State {
    news: I_News[];
}

export class NewsSection extends Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            news: newsData.news as I_News[]
        }
        console.log(this.state.news);
    }

    render() {
        return (
            <View style={tw`my-4`}>
                <View style={tw`flex flex-row justify-between mx-6`}>
                    <Text style={tw`text-orange-500 font-extrabold uppercase mb-4`}>Actualités</Text>
                    <Link href="/(news)">Toutes les actualités</Link>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={tw`justify-between items-center gap-4 px-6`} style={tw` bg-gray-800 w-full h-50`}>
                    { this.state.news.map((item) => {
                        return (
                            <NewsCard key={item.id} id={item.id} />
                        );
                    }) }
                </ScrollView>
            </View>
        );
    }
}