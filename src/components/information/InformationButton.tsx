import {Text, TouchableOpacity, View} from "react-native";
import {Component} from "react";
import {Ionicons} from "@expo/vector-icons";
import tw from "twrnc";

interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export class InformationButton extends Component<Props> {
    render() {
        const {title, icon} = this.props;

        return (
            <TouchableOpacity style={tw`flex flex-col w-28 items-center justify-center border-2 border-gray-400 rounded-lg overflow-hidden p-2`} onPress={() => console.log('Bouton Cliqué !!!')}>
                <View>
                    <Ionicons name={icon} size={32} color="black" />
                </View>
                <View>
                    <Text style={tw`text-black font-bold text-sm text-center`}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}