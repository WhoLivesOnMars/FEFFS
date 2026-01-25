import React from "react";
import { ScrollView, View, Text } from "react-native";
import tw from "twrnc";

export default function TermsScreen() {
    return (
        <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`px-6 pt-8 pb-10`}
        >

            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Les présentes conditions d’utilisation s’appliquent à l’application
                mobile du Festival Européen du Film Fantastique de Strasbourg
                (ci-après « l’Application »), éditée pour le compte de
                Strasbourg European Fantastic Film Festival.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                1. Objet du service
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                L’Application permet de consulter la programmation du festival,
                les informations pratiques, les actualités, ainsi que de gérer son
                planning de séances. L’Application est fournie exclusivement à titre
                informatif et ne constitue pas un engagement contractuel sur le
                contenu de la programmation ou les horaires.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                2. Accès et utilisation
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                L’Application est accessible gratuitement, hors coûts de connexion
                facturés par votre opérateur. L’utilisateur s’engage à utiliser
                l’Application de manière loyale, uniquement pour un usage personnel
                et non commercial, et à ne pas tenter de porter atteinte à son bon
                fonctionnement ou à sa sécurité.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                3. Comptes et sécurité
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Certaines fonctionnalités peuvent nécessiter la création d’un compte
                (par exemple la gestion du profil ou du planning). L’utilisateur est
                responsable de la confidentialité de ses identifiants et de toute
                activité réalisée avec son compte. En cas de suspicion d’utilisation
                frauduleuse, il lui appartient de nous en informer sans délai.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                4. Propriété intellectuelle
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                L’ensemble des contenus de l’Application (textes, visuels, logos,
                affiches, informations de programmation) est protégé par les lois
                relatives à la propriété intellectuelle. Toute reproduction,
                modification ou diffusion non autorisée est strictement interdite.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                5. Limitation de responsabilité
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Malgré le soin apporté à la mise à jour des informations, Strasbourg
                European Fantastic Film Festival ne peut garantir l’absence totale
                d’erreurs ou d’omissions. Les horaires, films et lieux sont
                susceptibles d’être modifiés. L’Application est fournie « en l’état »
                et l’éditeur ne saurait être tenu responsable d’éventuels dommages
                résultant de son utilisation ou de son indisponibilité.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                6. Modifications des conditions
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Les présentes conditions peuvent être mises à jour à tout moment pour
                tenir compte de l’évolution de l’Application ou de la législation.
                La version applicable est celle disponible dans l’Application à la
                date de votre utilisation.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                7. Contact
            </Text>
            <Text style={tw`text-sm text-gray-600`}>
                Pour toute question concernant l’Application ou les présentes
                conditions d’utilisation, vous pouvez consulter le site officiel
                du festival ou nous contacter via les coordonnées indiquées sur
                strasbourgfestival.com.
            </Text>
        </ScrollView>
    );
}