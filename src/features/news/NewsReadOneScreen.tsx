import {Component} from "react";
import {View, Text, Image, ScrollView, TouchableOpacity} from "react-native";
import {I_News} from "@/src/interfaces/I_News";
import newsData from "@/assets/news.json";
import tw from "twrnc";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    news_id: number;
}

interface State {
    news: I_News;
}

export class NewsReadOneScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const allNews = newsData.news as unknown as I_News[];
        this.state = {
            news: allNews.find((news) => news.id === this.props.news_id) as I_News
        }
    }

    render() {
        return (
            <ScrollView horizontal={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={tw`px-6`}>
                <View style={tw`w-full h-64 border-transparent rounded-b-lg overflow-hidden`}>
                    <Image style={tw`w-full h-full`} source={{uri: this.state.news.thumbnail_image_url}} resizeMode="cover" />
                </View>
                <View style={tw`bg-gray-200 border-transparent rounded-lg p-4 overflow-hidden mt-4`}>
                    <View style={tw`flex flex-row justify-between items-center`}>
                        <View style={tw`flex flex-row flex-wrap gap-2 w-[70%]`}>
                            {this.state.news.tags.map(t => {
                                return (
                                    <Text style={tw`p-1 bg-orange-100 text-orange-700 border-[1px] border-orange-200 rounded-lg`}>{t}</Text>
                                )
                            })}
                        </View>
                        <Text style={tw`text-base`}>
                            {this.state.news.published_at}
                        </Text>
                    </View>
                    <Text style={tw`text-3xl font-bold mt-4`}>{this.state.news.name}</Text>
                    <View style={tw`mt-4`}>
                        {this.state.news.paragraphs.map((p, index) => {
                            const isLast = index === this.state.news.paragraphs.length - 1;
                            return (
                                <Text style={tw`text-sm ${isLast ? '' : 'mb-2'}`}>{p}</Text>
                            );
                        })}
                    </View>
                </View>
                <TouchableOpacity style={tw`flex flex-row justify-center items-center gap-2 mt-4 mb-20 bg-orange-200 py-2 border-2 border-orange-500 rounded-lg`}>
                    <Ionicons name={this.state.news.cta.icon} size={32} />
                    <Text style={tw`text-base font-semibold`}>{this.state.news.cta.label}</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}