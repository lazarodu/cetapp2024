import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import { QrCodeTypes } from "../../types/Screen.types";
import { apiProgram } from "../../services/data";
import { IProgram } from "../../interfaces/Program.interface";
import { LoadingComp } from "../../components";

export default function Program({ navigation }: QrCodeTypes) {
  const [loading, setLoading] = useState(false)
  const [program, setProgram] = useState<IProgram[]>([]);

  function handleQrCode(item: IProgram) {
    navigation.navigate("QrCode", { ...item });
  }

  useEffect(() => {
    async function loadProgram() {
      setLoading(true)
      const response = await apiProgram.index();
      setProgram(response.data.data);
      setLoading(false);
    }
    navigation.addListener("focus", () => loadProgram());
  }, []);

  interface itemMessage {
    item: {
      id: number
      horario: string
      atividade: string
      local: string
      publico: number
    }
  }
  const renderItem = (({ item }: itemMessage) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleQrCode(item)}>
        <Text style={styles.label}>Horário: </Text>
        <Text>{item.horario} </Text>
        <Text style={styles.label}>Atividade: </Text>
        <Text>{item.atividade} </Text>
        <Text style={styles.label}>Local: </Text>
        <Text>{item.local} </Text>
      </TouchableOpacity>
    );
  })
  if (loading) {
    return <LoadingComp />
  }
  return (
    <SafeAreaView style={styles.container}>
      {program.length > 0 && (
        <FlatList
          data={program}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          style={styles.container}
        />
      )}
    </SafeAreaView>
  );
}
