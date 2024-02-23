import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';


interface CardProps {
  index: number;
  card: any;
  handleCardPress: (index: number) => void;
  handleFlipAnimation: (index: number) => void;
  animatedValue: Animated.Value;
}

const Card: React.FC<CardProps> = ({ index, card, handleCardPress, handleFlipAnimation, animatedValue }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        handleCardPress(index);
        handleFlipAnimation(index);
      }}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.front,
          {
            transform: [
              {
                rotateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image style={styles.image} source={require('./Imagenes/atras.jpg')} />
      </Animated.View>
      <Animated.View
        style={[
          styles.front,
          {
            transform: [
              {
                rotateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['180deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image style={styles.image} source={card} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default Card;
