import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    centraliza: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        padding: 10
    },
    scanner: {
        width: Dimensions.get("window").width - 40,
        height: Dimensions.get("window").width - 40,
    },
    label: {
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
})

export default styles