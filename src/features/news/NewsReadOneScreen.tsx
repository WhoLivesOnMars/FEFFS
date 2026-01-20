import {Component} from "react";
import {View, Text} from "react-native";

interface Props {
    news_id: number;
}

export class NewsReadOneScreen extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>News {this.props.news_id}</Text>
            </View>
        );
    }
}