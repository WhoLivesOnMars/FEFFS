import {View, Text, Image, TouchableOpacity} from "react-native";
import {Component} from "react";
import tw from "twrnc";
import {router} from "expo-router";
import newsData from '@/assets/news.json';
import {I_News} from "@/src/interfaces/I_News";

interface Props {
    id: number;
}

interface State {
    news: I_News;
}

export class NewsCard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const allNews = newsData.news as unknown as I_News[];
        this.state = {
            news: allNews.find((news) => news.id === this.props.id) as I_News
        }
    }

    render() {
        const {id} = this.props;

        return (
            <TouchableOpacity style={tw`flex flex-col gap-2 w-45 h-40`} onPress={() => router.push(`/(news)/${id}`)}>
                <View style={tw`flex-1 border-transparent rounded-lg overflow-hidden`}>
                    <Image style={tw`w-full h-full`} source={{ uri: this.state.news.thumbnail_image_url }} resizeMode="cover" />
                </View>
                <View style={tw`flex-col justify-left`}>
                    <Text style={tw`uppercase text-white text-base`}>
                        { this.state.news.name }
                    </Text>
                    <Text style={tw`lowercase text-gray-300 text-xs`}>
                        { this.state.news.chapo.slice(0, 24) + '...' }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}