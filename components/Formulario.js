import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [horassimulador, sethorassimulador] = useState('');
  const [horasdescanco, sethorasdescanco] = useState('');
  const [horascardio, sethorascardio] = useState('');
  const [horasaerobico, sethorasaerobico] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      sethorassimulador(String(registroEmEdicao.horassimulador ?? ''));
      sethorasdescanco(String(registroEmEdicao.horasdescanco ?? ''));
      sethorascardio(String(registroEmEdicao.horascardio ?? ''));
      sethorasaerobico(String(registroEmEdicao.horasaerobico ?? ''));
    } else {
      sethorassimulador('');
      sethorasdescanco('');
      sethorascardio('');
      sethorasaerobico('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(horassimulador, horasdescanco, horascardio, horasaerobico);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Horas de Simulador"
        keyboardType="numeric"
        value={horassimulador}
        onChangeText={sethorassimulador}
      />
      <TextInput
        style={styles.input}
        placeholder="Horas de Descanço"
        keyboardType="numeric"
        value={horasdescanco}
        onChangeText={sethorasdescanco}
      />
      <TextInput
        style={styles.input}
        placeholder="Horas de Cardio"
        keyboardType="numeric"
        value={horascardio}
        onChangeText={sethorascardio}
      />
      <TextInput
        style={styles.input}
        placeholder="Horas de Aeróbico"
        keyboardType="numeric"
        value={horasaerobico}
        onChangeText={sethorasaerobico}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
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
    elevation: 3,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#C28800',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  botao: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#7f8c8d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
