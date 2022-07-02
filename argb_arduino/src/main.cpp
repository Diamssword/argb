#include <Arduino.h>
#include <FastLED.h>
#include <EEPROM.h>
// examples: https://github.com/FastLED/FastLED/blob/master/examples/ColorTemperature/ColorTemperature.ino
#define DATA_PIN 3
//#define CLK_PIN   4
#define LED_TYPE WS2811
#define COLOR_ORDER GRB
#define MAX_LEDS 17
CRGB leds[MAX_LEDS];

#define BRIGHTNESS 255

int MainTimer = 0;

struct Hardware
{
  uint8_t start = 0;
  uint8_t end = 1;
  uint8_t fps = 120;
  uint8_t pos = 0;
  uint8_t hue = 0;
  CHSV color1 = CHSV(255, 255, 255);
  CHSV color2 = CHSV(255, 255, 255);
  Hardware(uint8_t start, uint8_t end)
  {
    this->start = start;
    this->end = end;
  };
  Hardware()
  {
  }
  bool reverse = false;
  bool reverse1 = false;
  void (*modeFN)(Hardware&);
};
Hardware hardwares[10];   // we can't have unknown arrays size, so this will be limited a 10 "hardwares" (differents animations on differents parts of the total led strip)
uint8_t hardwareSize = 1; // so we track the real length with another variable;
CHSV darken(CHSV color, int brightness)
{
  return CHSV(color.hue, color.s, brightness);
}
void IndexChangeReverse(Hardware& hard)
{
  if (hard.reverse)
    hard.pos--;
  else
    hard.pos++;
  if (hard.pos >= hard.end)
  {
    hard.reverse = true;
    hard.pos = hard.end - 1;
  }
  else if (hard.pos < 0)
  {
    hard.reverse = false;
    hard.pos = 0;
  }
}

void IndexChange(Hardware& hard)
{
  hard.pos++;
  if (hard.pos >= hard.end)
  {
    hard.pos = 0;
  }
}
void cylon(Hardware& hard)
{
  IndexChangeReverse(hard);
  leds[hard.pos] = CHSV(hard.hue++, 255, 255);
  FastLED.show();
  // fading
  for (int i = 0; i < hard.end; i++)
  {
    leds[i].nscale8(250);
  }
}
void pulse(Hardware& hard)
{
  hard.color1.v = 255;
  hard.color2.v = 255;
  hard.hue += hard.reverse ? 1 : -1;
  if (hard.hue > 255)
  {
    hard.reverse = true;
    hard.hue--;
  }
  else if (hard.hue < 0)
  {
    hard.reverse = false;
    hard.hue++;
  }
  CRGB t = CRGB(hard.color1);
  CRGB t1 = CRGB(hard.color2);
  fill_gradient_RGB(leds, hard.end, t.fadeToBlackBy(hard.hue), t1.fadeToBlackBy(hard.hue));
  FastLED.show();
}

void rainbow(Hardware& hard)
{
  hard.hue = hard.hue + 1;
  // FastLED's built-in rainbow generator

  fill_rainbow(leds, hard.end, hard.hue, 7);
  FastLED.show();
}
void oddeven(Hardware& hard)
{
  hard.color1.v = 255;
  hard.color2.v = 255;
  FastLED.clear();

  hard.hue += hard.reverse1 ? -1 : +1;
  if (hard.hue >= 255)
  {
    hard.reverse1 = true;
    hard.reverse = !hard.reverse;
  }
  if (hard.hue <= 0)
  {
    hard.reverse1 = false;
  }
  for (int k = (hard.reverse ? 0 : 2); k < hard.end; k += 4)
  {

    CHSV col = hard.reverse ? hard.color1 : hard.color2;
    leds[k] = col;
    leds[k] = leds[k].fadeToBlackBy(hard.hue);
  }

  // FastLED's built-in rainbow generator
  FastLED.show();
}
void setMode(int mode, Hardware& hard)
{
  switch (mode)
  {
  case 1:
    hard.modeFN = &rainbow;
    break;
  case 2:
    hard.modeFN = &cylon;
    break;
  case 3:
    hard.modeFN = &oddeven;
    break;
  case 4:
    hard.hue = 255;
    hard.modeFN = &pulse;
    break;
  default:
    hard.modeFN = &rainbow;
    break;
  }
}
uint8_t getMemPosStart(uint8_t hardware)
{
  const int count = 9;
  const int offset = 1;
  uint8_t pos = (hardware * count) + offset;
  if (pos + count >= EEPROM.length())
    return offset;
  return pos;
}
void readConfig(uint8_t hardware)
{
  uint8_t pos = getMemPosStart(hardware);
  Hardware& h = hardwares[hardware];
  h.start=EEPROM.read(pos);
  h.end=EEPROM.read(pos+1);
  setMode(EEPROM.read(pos+2), h);
  h.fps = EEPROM.read(pos + 3);
  // time =EEPROM.read(2); max 255> pas d'interet a sauvegarde une valeur en ms (et pas possible de save -1)
  h.color1 = CHSV(EEPROM.read(pos + 4), EEPROM.read(pos + 5), EEPROM.read(pos + 6));
  h.color2 = CHSV(EEPROM.read(pos + 7), EEPROM.read(pos + 8), EEPROM.read(pos + 9));
}
void saveConfig(uint8_t mode, uint8_t hardware)
{
  Hardware& h = hardwares[hardware];
  uint8_t pos = getMemPosStart(hardware);
  EEPROM.write(pos, h.start);
  EEPROM.write(pos + 1, h.end);
  EEPROM.write(pos + 2, mode);
  EEPROM.write(pos + 3, h.fps);
  EEPROM.write(pos + 4, h.color1.h);
  EEPROM.write(pos + 5, h.color1.s);
  EEPROM.write(pos + 6, h.color1.v);
  EEPROM.write(pos + 7, h.color2.h);
  EEPROM.write(pos + 8, h.color2.s);
  EEPROM.write(pos + 9, h.color2.v);
}

void receiveHardCmd(String s)
{
  hardwareSize = 0;
  while (s.length() > 1)
  {
    int pos = s.indexOf(";");
    if (pos >= 1)
    {
      String content = s.substring(0, pos);
      uint8_t lastrIndex = 0;
      if (hardwareSize - 1 >= 0)
      {
        lastrIndex = hardwares[hardwareSize - 1].end + 1;
      }
      hardwares[hardwareSize].start=lastrIndex;
      hardwares[hardwareSize].pos=0;
      hardwares[hardwareSize].end=lastrIndex+content.toInt();
      saveConfig(0,hardwareSize);
      hardwareSize++;
  
    }
    EEPROM.write(0,hardwareSize);
    if(pos+1 >= s.length())
      break;
    s = s.substring(pos + 1);
  }
  fadeToBlackBy(leds,MAX_LEDS,255);

  // TOD definir tout les hardwares d'un coup ici du genre : /hrgb 17;12;3 pour un hard de 17, de 12 puis de 3;
}
void receiveCommand(String s)
{
  Hardware& hard = hardwares[0];
  int hardPos = 0;
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
            hard.color2 = colo;
          else
            hard.color1 = colo;

          content = content.substring(pos2 + 1);
          col2 = true;
          if (shouldExit)
            break;
        }
      }
      else
      {
        int m = content.toInt();
        if (cmd == 'h')
        {
          hard = hardwares[m];
          hardPos = m;
          if (m >= hardwareSize)
          {
            hard = hardwares[hardwareSize];
            hardPos = hardwareSize;
          }
        }
        else if (cmd == 'a')
        {
          mode = m;
          setMode(mode, hard);
        }
        else if (cmd == 'f')
        {
          hard.fps = m;
        }
        else if (cmd == 's')
        {
          saveConfig(mode, hardPos);
          EEPROM.write(0, hardwareSize);
        }
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
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, MAX_LEDS).setCorrection(TypicalLEDStrip);

  // set master brightness control
  FastLED.setBrightness(BRIGHTNESS);
  hardwares[0] = Hardware(0, MAX_LEDS);
  hardwares[0].modeFN = &rainbow;
  if (EEPROM.read(0) != 255) // check if eeprom have been written
  {
    hardwareSize = EEPROM.read(0);
    for (uint8_t i = 0; i < hardwareSize; i++)
    {
      readConfig(i);
    }
  } 
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
     else if (serialMsg.startsWith("/hrgb "))
    {
      receiveHardCmd(serialMsg.substring(6));
    }
    serialMsg = "";
  }
  delay(1);
  for (uint8_t i = 0; i < hardwareSize; i++)
  {
    Hardware& h = hardwares[i];
    if (h.modeFN != NULL)
    {
      float f = 1000 / h.fps;
      float d = ((float)MainTimer) / f;
      if (d == floor(d))
      {
        h.modeFN(h);
      }
    }
  }
  MainTimer++;

  // do some periodic updates
}
