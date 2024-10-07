import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import styles from "./styles";
import { ButtonComp, LoadingComp } from "../../components";
import { useRoute } from "@react-navigation/native";
import { IProgram, IProgramResponse } from "../../interfaces/Program.interface";
import { apiPresence } from "../../services/data";
import { AxiosError } from "axios";

const QrCode = () => {
    const route = useRoute()
    const { id, atividade, horario, local } = route.params as IProgram
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false)
    if (!permission) {
        return <LoadingComp />
    }
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Você precisa dar permissão para acesso à Câmera</Text>
                <ButtonComp onPress={requestPermission} type="login" title="Solicitar Permissão" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
        setScanned(true);
        try {
            setLoading(true);
            await apiPresence.store(Number(data), id)
            Alert.alert("Presença Registrada!")
            setLoading(false);
        } catch (error) {
            const err = error as AxiosError;
            const data = err.response?.data as IProgramResponse;
            let message = "";
            if (data.data) {
                for (const [key, value] of Object.entries(data.data)) {
                    message = `${message} ${value}`;
                }
            }
            if (message.indexOf('D u p l i c a t e   e n t r y') > 0) {
                Alert.alert(`Esta presença já foi registrada!!!`);
            } else {
                Alert.alert(`${data.message} ${message}`);
            }
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingComp />
    }
    return (
        <View style={styles.centraliza}>
            <View>
                <Text style={styles.label}>Horário: </Text>
                <Text>{horario} </Text>
                <Text style={styles.label}>Atividade: </Text>
                <Text>{atividade} </Text>
                <Text style={styles.label}>Local: </Text>
                <Text>{local} </Text>
            </View>

            {scanned ? (
                <ButtonComp
                    type="login"
                    title="Pressione para escanear novamente"
                    onPress={() => setScanned(false)}
                />
            ) : (
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.scanner}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />
            )}
        </View>
    );
};

export default QrCode;