# Nanoleaf Panel Controller for Elgato Stream Deck

This is an attempt at integrating the Stream Deck SDK with the Nanoleaf API to allow control of Nanoleaf light panels from Stream Deck buttons.

# Instructions

First install the Plugin and drag an instance to your Stream Deck.  Click on the instance and you will find 4 fields

* Title
* Nanoleaf IP Address
* Auth Token
* Effects

You're going to need to obtain your Nanoleaf IP address as there is no current way to search for Nanoleaf devices using JavaScript.  You can get your IP by looking at your router and finding what devices are attached via WiFi.  You want to find the entry with a MAC address that starts **00:55:DA**.  This will be your Nanoleaf controller.

Once you have your IP, enter it in the field provided.  The "Pair" button will now appear.  Put your Nanoleaf into *Pairing Mode* by holding down the power button on the controller for 5 seconds until the lights start flashing.  Now click **Pair** in the Stream Deck app and the Auth Token field will now be populated.  Congratulations, you have now paired your Stream Deck with your Nanoleaf!

All that's left is to click **Refresh** next to the Effects field, and the Plugin will populate that field with your available Effects.  Select the one you want from the drop-down, and then press the button on your Stream Deck to test.  Rename the button using the **Title** field as appropriate.  

The **Details** field should populate with any errors during Pairing or Refreshing.  If you find the button stops working, check to make sure your Nanoleaf IP hasn't changed - there is currently no way to set a static IP on Nanoleaf.  

Also in the **Effects** drop-down are On and Off, you can add buttons to perform these functions accordingly.  If you set a button to an effect and your Nanoleaf is off, it will automatically power on with you try to activate that effect with the Stream Deck.

Last thing, if you want more than one button (as most of us do) then just copy/paste the button or the IP/Auth Token, you don't need to re-pair the systems when you create a new button.  
