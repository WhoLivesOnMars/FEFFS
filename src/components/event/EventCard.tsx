import {Component} from "react";
import {ImageSourcePropType, View, Image, Text, Pressable } from "react-native";
import tw from "twrnc";

interface Props {
    source: ImageSourcePropType;
    title: string;
    onPress?: () => void;
}

export class EventCard extends Component<Props> {
    render () {
        const {source, title, onPress} = this.props;

        return (
            <Pressable onPress={onPress}>
                <View style={tw`flex flex-col size-25 border-transparent rounded-lg overflow-hidden`}>
                    <View style={tw`flex-2`}>
                        <Image style={tw`w-full h-full`} source={ source } resizeMode="cover" />
                    </View>
                    <View style={tw`flex-1 bg-orange-500 justify-center px-2 pt-1 pb-2`}>
                        <Text style={tw`text-center text-white text-xs`}>
                            { title }
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    }
}