import {Image, View} from "react-native";
import {Component} from "react";
import {EventsOfTheYearSection} from "@/src/features/home/sections/EventsOfTheYearSection";
import {NewsSection} from "@/src/features/home/sections/NewsSection";
import tw from "twrnc";
import {InformationSection} from "@/src/features/home/sections/InformationSection";

export class HomeScreen extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={tw`w-full h-64 border-transparent rounded-b-lg overflow-hidden`}>
                    <Image style={tw`w-full h-full`} source={{ uri: 'https://picsum.photos/1920/1080' }} resizeMode="cover" />
                </View>
                <EventsOfTheYearSection />
                <NewsSection />
                <InformationSection />
            </View>
        );
    }
}