import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Animated, StyleSheet } from 'react-native';
import Card from './Card';

const mazoDeCartas = [
  require('./Imagenes/1.jpg'),
  require('./Imagenes/2.jpg'),
  require('./Imagenes/3.jpg'),
  require('./Imagenes/4.jpg'),
  require('./Imagenes/5.jpg'),
  require('./Imagenes/6.jpg'),
];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App: React.FC = () => {
  const [turns, setTurns] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<any[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (matchedCards.length === mazoDeCartas.length) {
      setGameOver(true);
      Alert.alert('¡Has encontrado todos los pares!', `Lo lograste en ${attempts} intentos.`);
    }
  }, [matchedCards]);

  const resetGame = () => {
    const duplicatedCards: any[] = [];
    for (let i = 0; i < 2; i++) {
      duplicatedCards.push(...mazoDeCartas);
    }
    const newShuffledCards = shuffleArray(duplicatedCards);
    setShuffledCards(newShuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setTurns(0);
    setAttempts(0);
    setGameOver(false);
    setScrollEnabled(true);
    setAnimatedValues(newShuffledCards.map(() => new Animated.Value(0)));
  };

  const handleCardPress = (index: number) => {
    if (!gameOver && flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(shuffledCards[index])) {
      setFlippedCards([...flippedCards, index]);
      setTurns(turns + 1);
      if (flippedCards.length === 1) {
        const firstCardIndex = flippedCards[0];
        setAttempts(attempts + 1);
        if (shuffledCards[firstCardIndex] !== shuffledCards[index]) {
          setTimeout(() => {
            setFlippedCards([]);
          }, 1000);
          setTimeout(() => {
            hideCards(index, firstCardIndex);
          }, 1500);
        } else {
          setMatchedCards([...matchedCards, shuffledCards[firstCardIndex]]);
          setFlippedCards([]);
        }
      }
    }
  };

  const hideCards = (index1: number, index2: number) => {
    setAnimatedValues((prevValues) => {
      const newValues = [...prevValues];
      Animated.timing(newValues[index1], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(newValues[index2], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return newValues;
    });
  };

  const handleRestartGame = () => {
    resetGame();
    setGameOver(false);
    setTimeout(() => {
      setScrollEnabled(false);
    }, 100);
  };

  const handleFlipAnimation = (index: number) => {
    const newValue = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={scrollEnabled}>
      <Text style={styles.title}>Memory Game</Text>
      {!gameOver && (
        <View>
          <Text style={styles.infoText}>Intentos: {attempts}</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.text}>Nuevo juego</Text>
          </TouchableOpacity>
          <View><Text></Text></View>
        </View>
      )}
      <View style={styles.cardGrid}>
        {shuffledCards.map((card, index) => (
          <Card
            key={index}
            index={index}
            card={card}
            handleCardPress={handleCardPress}
            handleFlipAnimation={handleFlipAnimation}
            animatedValue={animatedValues[index]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#6A0DAD',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonContainer: {
    marginTop: 20,
  },
  gameOverContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 6,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 100,
    height: 135,
    margin: 5,
  },
  front: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default App;
