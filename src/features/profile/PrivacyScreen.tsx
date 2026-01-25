import React from "react";
import { ScrollView, View, Text } from "react-native";
import tw from "twrnc";

export default function PrivacyScreen() {
    return (
        <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`px-6 pt-8 pb-10`}
        >

            <Text style={tw`text-sm text-gray-600 mb-3`}>
                La présente politique décrit la manière dont Strasbourg European
                Fantastic Film Festival collecte et traite vos données personnelles
                dans le cadre de l’utilisation de l’application mobile officielle
                du Festival Européen du Film Fantastique de Strasbourg.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                1. Données collectées
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                L’Application peut traiter les catégories de données suivantes :
                adresse e-mail, préférences liées au compte utilisateur, paramètres
                d’affichage (thème), ainsi que des données techniques anonymisées
                liées au fonctionnement de l’Application (journal d’erreurs,
                statistiques d’usage agrégées).
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                2. Finalités du traitement
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Les données sont utilisées pour créer et gérer votre compte,
                personnaliser votre expérience (par exemple le thème visuel ou
                votre planning de séances), améliorer la qualité et la stabilité
                de l’Application et, le cas échéant, vous informer sur des
                mises à jour importantes concernant le festival.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                3. Base légale
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Le traitement de vos données repose, selon les cas, sur
                l’exécution du service que vous demandez (gestion de compte),
                votre consentement (par exemple pour certaines communications)
                ou l’intérêt légitime de l’éditeur à assurer le bon
                fonctionnement de l’Application.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                4. Durée de conservation
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Vos données sont conservées pendant la durée nécessaire à la
                gestion de votre compte et de l’Application. En cas d’inactivité
                prolongée ou de suppression de votre compte, les données
                correspondantes sont supprimées ou anonymisées, sauf obligation
                légale contraire.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                5. Partage des données
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Les données collectées ne sont pas revendues à des tiers. Elles
                peuvent être transmises uniquement à des prestataires techniques
                intervenant pour le compte du festival (hébergement, analyses
                statistiques) et uniquement dans la mesure nécessaire à la
                fourniture du service.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                6. Vos droits
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-3`}>
                Conformément à la réglementation applicable en matière de
                protection des données, vous disposez d’un droit d’accès, de
                rectification, d’effacement, de limitation du traitement et,
                le cas échéant, d’opposition. Vous pouvez également retirer
                votre consentement à tout moment lorsque celui-ci constitue
                la base légale du traitement.
            </Text>

            <Text style={tw`text-base font-semibold text-slate-900 mt-4 mb-2`}>
                7. Contact et réclamations
            </Text>
            <Text style={tw`text-sm text-gray-600`}>
                Pour exercer vos droits ou pour toute question concernant le
                traitement de vos données, vous pouvez nous contacter via les
                coordonnées disponibles sur le site officiel strasbourgfestival.com.
                Vous disposez également du droit d’introduire une réclamation
                auprès de l’autorité de contrôle compétente.
            </Text>
        </ScrollView>
    );
}