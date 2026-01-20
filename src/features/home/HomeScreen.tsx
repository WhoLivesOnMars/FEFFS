import {View} from "react-native";
import {Component} from "react";
import {EventsOfTheYearSection} from "@/src/features/home/sections/EventsOfTheYearSection";
import {NewsSection} from "@/src/features/home/sections/NewsSection";
import tw from "twrnc";

export class HomeScreen extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <EventsOfTheYearSection />
                <NewsSection />
            </View>
        );
    }
}