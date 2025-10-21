import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'; // Adicionando import necessário
import Grafico from './components/Grafico';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);
  const handleSave = (
    horassimulador,
    horasdescanco,
    horascardio,
    horasaerobico
  ) => {
    const simuladorNum = parseFloat(horassimulador) || 0;
    const descancoNum = parseFloat(horasdescanco) || 0;
    const cardioNum = parseFloat(horascardio) || 0;
    const aerobicoNum = parseFloat(horasaerobico) || 0;

    if (!horassimulador || !horasdescanco || !horascardio || !horasaerobico) {
      return Alert.alert(
        'Erro de Validação',
        'Todos os campos são obrigatórios. Por favor, preencha todos os campos.'
      );
    }

    if (
      simuladorNum < 0 ||
      descancoNum < 0 ||
      cardioNum < 0 ||
      aerobicoNum < 0
    ) {
      return Alert.alert(
        'Erro de Validação',
        'Nenhum valor pode ser negativo. Por favor, corrija.'
      );
    }

    if (
      simuladorNum > 24 ||
      descancoNum > 24 ||
      cardioNum > 24 ||
      aerobicoNum > 24
    ) {
      return Alert.alert(
        'Erro de Validação',
        'Os valores não podem exceder 24 horas. Por favor, verifique os dados.'
      );
    }

    if (registroEmEdicao) {
      // MODO DE ATUALIZAÇÃO
      const registrosAtualizados = registros.map((reg) =>
        reg.id === registroEmEdicao.id
          ? {
              ...reg,
              simulador: simuladorNum,
              descanco: descancoNum,
              cardio: cardioNum,
              aerobico: aerobicoNum,
            } // Mantém o ID e a data, atualiza o resto
          : reg
      );
      setRegistros(registrosAtualizados);
      Alert.alert('Sucesso!', 'Registro atualizado!');
    } else {
      // MODO DE CRIAÇÃO
      const novoRegistro = {
        id: new Date().getTime(),
        data: new Date().toLocaleDateString('pt-BR'),
        simulador: simuladorNum,
        descanco: descancoNum,
        cardio: cardioNum,
        aerobico: aerobicoNum,
      };
      setRegistros([...registros, novoRegistro]);
      Alert.alert('Sucesso!', 'Registro salvo!');
    }

    setRegistroEmEdicao(null); // Limpa o estado de edição e o formulário
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter((reg) => reg.id !== id));
    Alert.alert('Sucesso!', 'O registro foi deletado.');
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const exportarDados = async () => {
    try {
      if (registros.length === 0) {
        return Alert.alert('Aviso', 'Nenhum dado para exportar.');
      }

      const jsonString = JSON.stringify(registros, null, 2);

      if (Platform.OS === 'web') {
        // Exportação para web
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados_treinos_f1.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Alert.alert(
          'Sucesso',
          'Dados exportados com sucesso para dados_treinos_f1.json'
        );
      } else {
        // Exportação para mobile
        if (!(await Sharing.isAvailableAsync())) {
          return Alert.alert('Erro', 'Compartilhamento não disponível.');
        }

        // Criar arquivo temporário
        const fileUri = FileSystem.documentDirectory + 'dados_treinos_f1.json';
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Dados de Treinos F1',
        });
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao exportar os dados.');
    }
  };

  const [ordenacao, setOrdenacao] = useState('recentes'); // valor inicial
  let registrosExibidos = [...registros]; // Sempre trabalhe com uma cópia!

  if (ordenacao === 'maior_simulador') {
    // O método .sort() modifica o array, por isso a cópia é importante.
    // ⚡️ Substitua 'agua' pelo nome do seu campo.
    registrosExibidos.sort((a, b) => a.simulador - b.simulador);
  } else {
    // Ordenação padrão por 'recentes' (ID maior primeiro)
    registrosExibidos.sort((a, b) => b.id - a.id);
  }
  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Esta função será chamada pelo botão "Editar" de um item da lista
  const handleIniciarEdicao = (registro) => {
    setRegistroEmEdicao(registro);
  };

  // Esta função será chamada pelo botão "Cancelar Edição" do formulário
  const handleCancelarEdicao = () => {
    setRegistroEmEdicao(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Diário de Treinos F1🏎️</Text>
        <Text style={styles.subtituloApp}>App Componentizado</Text>

        <Grafico style={styles.grafico} registros={registrosExibidos} />

        <Formulario
          onSave={handleSave}
          onCancel={handleCancelarEdicao}
          registroEmEdicao={registroEmEdicao}
        />
        <View style={styles.botoesOrdenacao}>
          <Button
            title="Mais Recentes"
            onPress={() => setOrdenacao('recentes')}
          />
          <Button
            title="Maior tempo Simulador"
            onPress={() => setOrdenacao('maior_simulador')}
          />
        </View>
        <ListaRegistros
          registros={registrosExibidos}
          onEdit={handleIniciarEdicao}
          onDelete={handleDelete}
        />
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Exportar Dados</Text>
          <TouchableOpacity
            style={styles.botaoExportar}
            onPress={exportarDados}>
            <Text style={styles.botaoTexto}>Exportar arquivo JSON</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.direitos}>Feito por: João Felipe Lautert</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#c4c4c4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FF0000',
    padding: 5,
  },
  subtituloApp: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0b0029',
    marginTop: -20,
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
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
  botaoExportar: {
    backgroundColor: '#27ae60',
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
  botoesOrdenacao: {
    borderCurve: '50%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  grafico: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  direitos: {
    padding: 10,
  }
});
