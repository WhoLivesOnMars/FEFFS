import tw from 'twrnc';
import {View, Text} from "react-native";
import {Component} from "react";

export class HomeScreen extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={tw`text-5xl text-red-900 bg-blue-500`}>Une superbe page d'accueil.</Text>
            </View>
        );
    }
}