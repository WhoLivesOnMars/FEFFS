import {Text, TouchableOpacity, View} from "react-native";
import {Component} from "react";
import {Ionicons} from "@expo/vector-icons";
import tw from "twrnc";
import { ThemeContext } from "@/src/context/ThemeContext";

interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export class InformationButton extends Component<Props> {
    render() {
        const {title, icon} = this.props;

        return (
            <ThemeContext.Consumer>
                {(value) => {
                    if (!value) return null;

                    const { theme } = value;
                    const isDark = theme === "dark";

                    return (
                        <TouchableOpacity
                            style={[
                                tw`flex flex-col w-28 items-center justify-center rounded-lg overflow-hidden p-2`,
                                {
                                    borderWidth: 2,
                                    borderColor: isDark ? "#fafafa" : "#9ca3af",
                                },
                            ]}
                            onPress={() => console.log("Bouton Cliqué !!!")}
                        >
                            <View>
                                <Ionicons
                                    name={icon}
                                    size={32}
                                    color={isDark ? "#fafafa" : "#000000"}
                                />
                            </View>

                            <View>
                                <Text
                                    style={[
                                        tw`font-bold text-sm text-center`,
                                        { color: isDark ? "#fafafa" : "#000000" },
                                    ]}
                                >
                                    {title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            </ThemeContext.Consumer>
        );
    }
}