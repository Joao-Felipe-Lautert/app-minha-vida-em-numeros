import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, } from 'react-native';

export default function ListaRegistros({ registros, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>Registros Salvos (Read, Update, Delete)</Text>
      {registros.length > 0 ? [...registros].reverse().map(reg => (
        <View key={reg.id} style={styles.itemHistorico}>
          <Text style={styles.itemTexto}>
            {reg.data} simulador: {reg.simulador}h, descanco: {reg.descanco}h, , cardio: {reg.cardio}h, aerobico: {reg.aerobico}h
          </Text>
          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => onEdit(reg)}>
              <Button title="✏️" onPress={() => onEdit(reg)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoDelete} onPress={() => onDelete(reg.id)}>
              <Text style={styles.botaoTextoAcao}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )) : (
        <Text style={styles.itemTexto}>Nenhum registro encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: { 
      backgroundColor: '#0b0029', 
      borderRadius: 8, 
      padding: 15,
      marginHorizontal: 15, 
      marginBottom: 20, 
      elevation: 3
    },
    subtitulo: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      marginBottom: 15, 
      color: '#C28800' 
    },
    itemHistorico: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingVertical: 10, 
      borderBottomWidth: 1, 
      borderColor: '#eee' 
    },
    itemTexto: { 
      fontSize: 16, 
      color: 'white' 
    },
    botoesAcao: { 
      flexDirection: 'row' 
    },
    botaoEditar: { 
      backgroundColor: '#f39c12', 
      borderRadius: 15, 
      width: 30, 
      height: 30, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginRight: 10 
    },
    botaoDelete: { 
      backgroundColor: '#e74c3c', 
      borderRadius: 15, 
      width: 30, 
      height: 30, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    botaoTextoAcao: { 
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: 16 
    },
    
});