import React, { useState, useEffect } from "react";
import { View, Text, KeyboardAvoidingView, TextInput, Alert } from "react-native";
import { ButtonComp, LoadingComp } from "../../components"
import styles from "./styles";
import { useAuth } from "../../hook/auth";
import { LoginTypes } from "../../types/Screen.types";
import { IAuthenticate, IUser } from "../../interfaces/User.interface";
import { AxiosError } from "axios";

export default function Login({ navigation }: LoginTypes) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IAuthenticate>();

  function handleChange(item: IAuthenticate) {
    setData({ ...data, ...item });
  }
  async function handleSignIn() {
    try {
      setLoading(true);
      if (data?.email && data.password) {
        const response = await signIn(data);
        setLoading(false);
        console.log(response)
        if (!response) {
          Alert.alert("Você não tem permissão para acessar!!!");
        }
      } else {
        Alert.alert("Preencha todos os campos!!!");
        setLoading(false);
      }
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data as IUser;
      let message = "";
      console.log(err)
      if (data.data) {
        for (const [key, value] of Object.entries(data.data)) {
          message = `${message} ${value}`;
        }
      }
      Alert.alert(`${data.message} ${message}`);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return <LoadingComp />
  }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.title}>LOGIN</Text>
        <View style={styles.input}>
          <TextInput
            style={{ width: 280, padding: 7, fontSize: 18 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(i) => handleChange({ email: i })}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            style={{ width: 280, padding: 7, fontSize: 18 }}
            placeholder="Senha"
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(i) => handleChange({ password: i })}
          />
        </View>
        <View>
          <ButtonComp title="Login" type="login" onPress={handleSignIn} />
        </View>
      </KeyboardAvoidingView>
    </View>
  )

}