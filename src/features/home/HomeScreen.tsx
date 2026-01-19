import {View, Text} from "react-native";
import {Component} from "react";

export class HomeScreen extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>Une superbe page d'accueil.</Text>
            </View>
        );
    }
}