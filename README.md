# Nanoleaf Panel Controller for Elgato Stream Deck

# V0.3 released 2/1/2019

Now includes 2 different actions (Controls and Effects) and can control Brightness.  The Plugin also works in Multi-Actions now, so you can perform multiple things like turning Nanoleaf On, set the Brightness to 50% and set the Effect to Flame all with one Stream Deck button.

# Instructions

This is an attempt at integrating the Stream Deck SDK with the Nanoleaf API to allow control of Nanoleaf light panels from Stream Deck buttons.

There are 2 different Actions available for this Plugin - Controls and Effects.  Controls are things like On/Off/Brightness and Effects are things like Flow, Snowfall, Fireworks etc.  To get started, drag either a Controls or Effects Action to your deck.  Click on the new instance, and some fields will appear as below : 

![Field Screenshot](/images/fields.png?raw=true "Field Screenshot")

You're going to need to obtain your Nanoleaf IP address as there is no current way to search for Nanoleaf devices using JavaScript.  You can get your IP by looking at your router and finding what devices are attached via WiFi.  You want to find the entry with a MAC address that starts **00:55:DA**.  This will be your Nanoleaf controller.

![IP Example](/images/IP.png?raw=true "IP Example")

Once you have your IP, enter it in the field provided.  The "Pair" button will now appear.  Put your Nanoleaf into *Pairing Mode* by holding down the power button on the controller for 5 seconds until the lights start flashing.  Now click **Pair** in the Stream Deck app and the Auth Token field will now be populated.  Congratulations, you have now paired your Stream Deck with your Nanoleaf!

![Pairing](/images/controls.png?raw=true "Pairing")

All that's left is to click **Refresh** next to the Effects field, and the Plugin will populate that field with your available Effects.  Select the one you want from the drop-down, and then press the button on your Stream Deck to test.  Rename the button using the **Title** field as appropriate.  

The **Details** field should populate with any errors during Pairing or Refreshing.  If you find the button stops working, check to make sure your Nanoleaf IP hasn't changed - there is currently no way to set a static IP on Nanoleaf.  

If you choose a Controls Action, the fields shown will be mostly the same except for the Controls dropdown, and the option Value field.  If you choose On or Off then the button will perform that action.  If you choose Brightness- or Brightness+ then the button will raise or lower the Brightness by the % value specified.  Lastly if you just choose Brightness the button will set the Nanoleaf Brightness to that exact % level (useful if you want to set Brightness to exactly 50% or something like that).  

Last thing, if you want more than one button (as most of us do) then just copy/paste the button or the IP/Auth Token, you don't need to re-pair the systems when you create a new button even if they are different Actions.  The IP and Token will be the same.  

Thanks, and enjoy!
