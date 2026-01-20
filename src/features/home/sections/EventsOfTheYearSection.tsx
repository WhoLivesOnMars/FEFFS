import tw from 'twrnc';
import {View, Text} from "react-native";
import {Component} from "react";
import {EventCard} from "@/src/components/event/EventCard";

export class EventsOfTheYearSection extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={tw`mx-6 my-4`}>
                <Text style={tw`text-orange-500 font-extrabold uppercase mb-4`}>Évènements à l'année</Text>
                <View style={tw`flex flex-row justify-between`}>
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Cinéma plein air" />
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Cinéma de quartier" />
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Palmarès" />
                </View>
            </View>
        );
    }
}