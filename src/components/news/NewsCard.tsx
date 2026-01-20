import {ImageSourcePropType, View, Text, Image} from "react-native";
import {Component} from "react";
import tw from "twrnc";

interface Props {
    source: ImageSourcePropType;
    title: string;
    chapo: string;
}

export class NewsCard extends Component<Props> {
    render() {
        const {source, title, chapo} = this.props;

        return (
            <View style={tw`flex flex-col gap-2 h-40`}>
                <View style={tw`flex-1 border-transparent rounded-lg overflow-hidden`}>
                    <Image style={tw`w-full h-full`} source={ source } resizeMode="cover" />
                </View>
                <View style={tw`flex-col justify-left`}>
                    <Text style={tw`uppercase text-white text-base`}>
                        { title }
                    </Text>
                    <Text style={tw`lowercase text-gray-300 text-xs`}>
                        { chapo }
                    </Text>
                </View>
            </View>
        );
    }
}