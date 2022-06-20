#include <Arduino.h>
#include <FastLED.h>
#include <EEPROM.h>
// examples: https://github.com/FastLED/FastLED/blob/master/examples/ColorTemperature/ColorTemperature.ino
#define DATA_PIN 3
//#define CLK_PIN   4
#define LED_TYPE WS2811
#define COLOR_ORDER GRB
#define NUM_LEDS 17
CRGB leds[NUM_LEDS];

#define BRIGHTNESS 255

int MainTimer = 0;
int MainTimer1 = 0;
int fps = 100; // nombre de fois ou la boucle d'animation est executé par seconde
int time = -1; // time m'est la var "shouldUpdate" a true tout les X temps (compteur parallele aux fps)
void (*modeFN)(void);
uint8_t hue = 0;         // rotating "base color" used by many of the patterns
int pos = 0;             // index de la derniere led changée
boolean reverse = false; // si on devrait tournée 'en arriere'
boolean reverse1 = false;
boolean shouldUpdate = false;

CHSV color1 = CHSV(255, 255, 255);
CHSV color2 = CHSV(125, 255, 255);

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
  // fading
  for (int i = 0; i < NUM_LEDS; i++)
  {
    leds[i].nscale8(250);
  }
}
void pulse()
{
  color1.v = 255;
  color2.v = 255;
  hue += reverse ? 1 : -1;
  if (hue > 255)
  {
    reverse = true;
    hue--;
  }
  else if (hue < 0)
  {
    reverse = false;
    hue++;
  }
  CRGB t = CRGB(color1);
  CRGB t1 = CRGB(color2);
  fill_gradient_RGB(leds, NUM_LEDS, t.fadeToBlackBy(hue), t1.fadeToBlackBy(hue));
  FastLED.show();
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
  color1.v = 255;
  color2.v = 255;
  FastLED.clear();

  hue += reverse1 ? -1 : +1;
  if (hue >= 255)
  {
    reverse1 = true;
    reverse = !reverse;
  }
  if (hue <= 0)
  {
    reverse1 = false;
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
void setMode(int mode)
{
  switch (mode)
  {
  case 1:
    modeFN = &rainbow;
    break;
  case 2:
    modeFN = &cylon;
    break;
  case 3:
    modeFN = &oddeven;
    break;
  case 4:
    hue = 255;
    modeFN = &pulse;
    break;
  default:
    modeFN = &rainbow;
    break;
  }
}
void readConfig()
{
  setMode(EEPROM.read(0));
  fps = EEPROM.read(1);
  // time =EEPROM.read(2); max 255> pas d'interet a sauvegarde une valeur en ms (et pas possible de save -1)
  color1 = CHSV(EEPROM.read(3), EEPROM.read(4), EEPROM.read(5));
  color2 = CHSV(EEPROM.read(6), EEPROM.read(7), EEPROM.read(8));
}
void saveConfig(int mode)
{
  EEPROM.write(0, mode);
  EEPROM.write(1, fps);
  // EEPROM.write(2,time);
  EEPROM.write(3, color1.h);
  EEPROM.write(4, color1.s);
  EEPROM.write(5, color1.v);
  EEPROM.write(6, color2.h);
  EEPROM.write(7, color2.s);
  EEPROM.write(8, color2.v);
}
void receiveCommand(String s)
{
  int mode = 0;
  while (s.length() > 0)
  {
    int pos = s.indexOf(":");
    char cmd = '0';
    if (pos >= 1)
    {
      cmd = s.charAt(pos - 1);
    }
    int pos1 = s.indexOf(";");
    if (pos1 > -1)
    {
      String content = s.substring(pos + 1, pos1);
      if (cmd == 'c')
      {
        boolean shouldExit = false;
        boolean col2 = false;
        while (content.length() > 0)
        {
          int pos2 = content.indexOf(',');
          if (pos2 < 0)
          {
            pos2 = content.length();
            shouldExit = true;
          }
          String col = content.substring(0, pos2);
          CHSV colo = CHSV(0, 0, 0);

          for (int k = 0; k < 3; k++)
          {
            int pos3 = col.indexOf('/');
            int i1 = col.substring(0, pos3).toInt();
            col = col.substring(pos3 + 1);
            if (k == 0)
              colo.h = i1;
            else if (k == 1)
              colo.s = i1;
            else if (k == 2)
              colo.v = i1;
          }
          if (col2)
            color2 = colo;
          else
            color1 = colo;

          content = content.substring(pos2 + 1);
          col2 = true;
          if (shouldExit)
            break;
        }
      }
      else
      {
        int m = content.toInt();
        if (cmd == 'a')
        {
          mode = m;
          setMode(mode);
        }
        else if (cmd == 'f')
          fps = m;
        else if (cmd == 't')
          time = m;
        else if (cmd == 's')
          saveConfig(mode);
      }
    }
    if (pos <= -1 || pos1 <= -1)
      break;
    s = s.substring(pos1 + 1);
  }
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
  if (EEPROM.read(0) != 255)
    readConfig();
}
String serialMsg = "";
void loop()
{
  // Call the current pattern function once, updating the 'leds' array
  // FastLED.clear(true);
  // rainbow();
  // send the 'leds' array out to the actual LED strip
  // FastLED.show();
  // insert a delay to keep the framerate modest
  while (Serial.available() > 0)
  {
    char c = Serial.read(); // gets one byte from serial buffer
    serialMsg += c;         // makes the string readString
    if (c == '\n' || c == '\r')
      break;
  }
  if (serialMsg.length() > 0 && serialMsg.endsWith(String('\n')))
  {
    if (serialMsg.startsWith("/argb "))
    {
      receiveCommand(serialMsg.substring(6));
    }
    serialMsg = "";
  }
  delay(1);
  MainTimer++;
  MainTimer1++;
  if (MainTimer >= 1000 / fps)
  {
    modeFN();
    MainTimer = 0;
  }
  if (time > -1 && MainTimer1 >= time)
  {
    shouldUpdate = true;
    MainTimer1 = 0;
  }

  // do some periodic updates
}
