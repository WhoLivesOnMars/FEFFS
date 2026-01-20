import {Component} from "react";
import {Text, View} from "react-native";
import {InformationButton} from "@/src/components/information/InformationButton";
import tw from "twrnc";

export class InformationSection extends Component {
    constructor(props: any) {
        super(props);
    }
    
    render() {
        return (
            <View style={tw`my-4 mx-6`}>
                <View>
                    <Text style={tw`text-orange-500 font-extrabold uppercase mb-4`}>Informations</Text>
                </View>
                <View style={tw`flex flex-row justify-between mb-4`}>
                    <InformationButton title={'Accréditations'} icon={'videocam-outline'} />
                    <InformationButton title={'Bénévolat'} icon={'heart-outline'} />
                    <InformationButton title={'Devenir partenaire'} icon={'globe-outline'} />
                </View>
                <View style={tw`flex flex-row justify-center gap-4`}>
                    <InformationButton title={'Les adresses du FEFFS'} icon={'navigate-outline'} />
                    <InformationButton title={'Soumission'} icon={'albums-outline'} />
                </View>
            </View>
        );
    }
}