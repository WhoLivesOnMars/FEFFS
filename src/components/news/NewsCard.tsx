import {ImageSourcePropType, View, Text, Image, TouchableOpacity} from "react-native";
import {Component} from "react";
import tw from "twrnc";
import {router} from "expo-router";

interface Props {
    id: number;
    source: ImageSourcePropType;
    title: string;
    chapo: string;
}

export class NewsCard extends Component<Props> {
    render() {
        const {id, source, title, chapo} = this.props;

        return (
            <TouchableOpacity style={tw`flex flex-col gap-2 w-45 h-40`} onPress={() => router.push(`/(news)/${id}`)}>
                <View style={tw`flex-1 border-transparent rounded-lg overflow-hidden`}>
                    <Image style={tw`w-full h-full`} source={ source } resizeMode="cover" />
                </View>
                <View style={tw`flex-col justify-left`}>
                    <Text style={tw`uppercase text-white text-base`}>
                        { title }
                    </Text>
                    <Text style={tw`lowercase text-gray-300 text-xs`}>
                        { chapo.slice(0, 24) + '...' }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}