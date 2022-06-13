#include <Arduino.h>
#include <FastLED.h>
// examples: https://github.com/FastLED/FastLED/blob/master/examples/ColorTemperature/ColorTemperature.ino
#define DATA_PIN 3
//#define CLK_PIN   4
#define LED_TYPE WS2811
#define COLOR_ORDER GRB
#define NUM_LEDS 17
CRGB leds[NUM_LEDS];

#define BRIGHTNESS 255

#define TEMPERATURE_1 Tungsten100W
#define TEMPERATURE_2 OvercastSky
#define M_RAINBOW 0;
#define M_PULSE 1;
#define M_ODDEVEN 2;
#define M_CYLON 3;
int fps = 100;  // nombre de fois ou la boucle d'animation est executé par seconde
int time = -1; // time m'est la var "shouldUpdate" a true tout les X temps (compteur parallele aux fps)
void (*modeFN)(void);
uint8_t hue = 0;         // rotating "base color" used by many of the patterns
int pos = 0;             // index de la derniere led changée
boolean reverse = false; // si on devrait tournée 'en arriere'
boolean shouldUpdate = false;

CHSV color1 = CHSV(255, 255, 255);
CHSV color2 = CHSV(125, 255, 255);

void fadeall()
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].nscale8(250);
  }
}
CHSV darken(CHSV color, int brightness)
{

  return CHSV(color.hue, color.s, brightness);
}
void IndexChangeReverse()
{
  if (reverse)
    pos--;
  else
    pos++;
  if (pos >= NUM_LEDS)
  {
    reverse = true;
    pos = NUM_LEDS - 1;
  }
  else if (pos < 0)
  {
    reverse = false;
    pos = 0;
  }
}
void IndexChange()
{
  pos++;
  if (pos >= NUM_LEDS)
  {
    pos = 0;
  }
}
void cylon()
{
  IndexChangeReverse();
  leds[pos] = CHSV(hue++, 255, 255);
  FastLED.show();
  fadeall();
}

void rainbow()
{
  hue++;
  // FastLED's built-in rainbow generator

  fill_rainbow(leds, NUM_LEDS, hue, 7);
  FastLED.show();
}
void oddeven()
{
  FastLED.clear();
  if (shouldUpdate)
  {
    reverse = !reverse;
    hue = reverse?255:0;
    shouldUpdate = false;
  }
  hue += reverse? -1:+1;
  if (hue >= 255)
  {
    shouldUpdate = true;
  }

  for (int k = (reverse ? 0 : 2); k < NUM_LEDS; k += 4)
  {

    CHSV col = reverse ? color1 : color2;
    leds[k] = col;
    leds[k] = leds[k].fadeToBlackBy(hue);
  }
  // FastLED's built-in rainbow generator
  FastLED.show();
}

void receiveCommand(String s)
{
Serial.println(s);
}
void setup()
{
  Serial.begin(9600);
  delay(3000); // 3 second delay for recovery
  // tell FastLED about the LED strip configuration
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);
  modeFN = &rainbow;
}
  String serialMsg="";
void loop()
{
  // Call the current pattern function once, updating the 'leds' array
  // FastLED.clear(true);
  // rainbow();
  // send the 'leds' array out to the actual LED strip
  // FastLED.show();
  // insert a delay to keep the framerate modest
  while(Serial.available()>0) {
      char c = Serial.read();  //gets one byte from serial buffer
      
      serialMsg += c; //makes the string readString
      if(c == '\n' || c=='\r')
      break;
  }
  
   if (serialMsg.length() >0 && serialMsg.endsWith(String('\n'))) {
    if (serialMsg.startsWith("/argb "))
    {
      receiveCommand(serialMsg.substring(6));
    }
    serialMsg = "";
   }
  delay(10);
  if (time > -1)
  {
    EVERY_N_MILLISECONDS(time) { shouldUpdate = true; };
  }
  EVERY_N_MILLISECONDS(1000 / fps) { modeFN(); }
  // do some periodic updates
}
