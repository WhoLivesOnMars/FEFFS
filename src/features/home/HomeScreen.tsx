import {View} from "react-native";
import {Component} from "react";
import {EventsOfTheYearSection} from "@/src/features/home/sections/EventsOfTheYearSection";

export class HomeScreen extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <EventsOfTheYearSection />
            </View>
        );
    }
}