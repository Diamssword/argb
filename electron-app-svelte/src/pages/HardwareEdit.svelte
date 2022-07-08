<script>
  import { Button, TextInput } from "@svelteuidev/core";
  import { ActionIcon } from "@svelteuidev/core";
  import Icon from "../components/icons.svelte";
  import {
    Hardware,
    TYPES,
    VirtualHardware,
    getCommand,
  } from "../../build/Hardwares";
  import PortSelect from "../components/portSelect.svelte";
  import HardwareComp from "../components/hadware.svelte";
  import InputValidate from "../components/InputValidate.svelte";
import { LedAnimation } from "../../build/Animations";
import { LIST } from "../../build/AnimationsList";
  var profileID;
  var profileList = [];
  var hardwares = [];
  var vHardwares = [];
  var connections = [];
  var nameInput;
  $: if (profileID && profileList.length > 0) {
    window.send("hardware.request", profileID);
  }
  window.receive("hardware.request", (args) => {
    vHardwares = [];
    hardwares = [];
    connections = [];
    for (let d in args) {
      let a = new VirtualHardware("", "");
      a.fromObject(args[d]);
      vHardwares.push(a);

      hardwares.push(...a.composition);
    }
    for (let k = 0; k < hardwares.length; k++) {
      if (hardwares[k].linkedBefore == true) {
        if (k - 1 >= 0) connections[k - 1] = true;
      }
    }
    connections = [...connections];
    if (hardwares.length == 0)
      hardwares.push(new Hardware(0, "default0", 0, TYPES.fan));
    let p =0;
    let ratio = 256/vHardwares.length;
    for(let d in vHardwares)
    {
        for(let f in vHardwares[d].composition)
        {
            animations[p]=new LedAnimation("test").setFPS(5).setAnimationObj(LIST.Cable).addColors({hue:ratio*(parseInt(d)+1),saturation:255,value:255},{hue:(ratio/2)*(parseInt(d)+1),saturation:255,value:255});
            p++;
        }
    }

  });
  window.send("hardware.profiles");
  window.receive("hardware.profiles", (args) => {
    profileList = args;
    if (profileList.length <= 0) createProfile();
    else {
      profileID = profileList[0];
    }
  });
  window.receive("hardware.editProfile", (args) => {
    if (args.operation == "new") {
      profileList = [...profileList, args.name];

      profileID = args.name;
    }
    if (args.operation == "rename") {
      if (args.error) {
      } else {
        let ind = profileList.indexOf(args.from);
        if (ind > -1) {
          profileList[ind] = args.to;
          profileID = args.to;
          nameInput = "";
        }
      }
    }
  });
  function rename() {
    if (nameInput.length > 0) {
      window.send("hardware.editProfile", {
        operation: "rename",
        name: profileID,
        rename: nameInput,
      });
    }
  }
  function createProfile() {
    window.send("hardware.editProfile", {
      operation: "new",
      name: "myHardware",
    });
  }
  function save() {
    for (let k = 0; k < hardwares.length; k++) {
      var h = hardwares[k];
      if (connections[k - 1] == true)
        h.linkedBefore = true;
      else
        h.linkedBefore = false;
      window.send("hardware.save", {
        name: profileID,
        hard: hardwares,
        port: "COM",
      });
    }
  }
  function delet() {
    if (
      window.confirm("Do you want to remove this config forever (a long time)?")
    ) {
      window.send("hardware.editProfile", {
        operation: "delete",
        name: profileID,
      });
      let ind = profileList.indexOf(profileID);
      if (ind > -1) profileList.splice(ind);
      profileList = [...profileList];
      profileID = profileList[0];
    }
  }
  function sendLive()
  {
    if(COMconn)
    {
       
    window.send("vhardware.request",{port:COMconn,hard:hardwares})
    }
  }
  window.receive("vhardware.request",(re)=>{
    if(re && re.length>0)
    {
        for(let d in re)
        {
            re[d] =new VirtualHardware("","").fromObject(re[d]);
        }
        window.send("Serial.send",getCommand(re))
        let i=0;
        for(let f in re)
        {
            const com=animations[i].getCommand(f);
            i+=re[f].composition.length;
          setTimeout(() => {
            console.log(com);
            window.send("Serial.send", com);
          },2000*f); 
            
        }
        
        
    }
  });
  var COMconn;
  $:if(COMconn)
  {
    setTimeout(() => {
        sendLive();
    }, 4000);
  }
  
  var animations=[];

</script>

<h3>Profile</h3>
<InputValidate on:click={createProfile} text="+">
  <select bind:value={profileID}>
    {#each profileList as prof}
      <option value={prof}>{prof}</option>
    {/each}
  </select>
</InputValidate>
<hr />
<InputValidate on:click={rename} text="Change">
  <TextInput
    description="Name"
    placeholder={profileID}
    bind:value={nameInput}
  />
</InputValidate>
View Live:
<PortSelect autoConnect={false} on:connected={(e)=>{COMconn = e.detail.port}} />
<div>
  {#each hardwares as hard, i}
    <HardwareComp bind:hardware={hardwares[i]} animation={animations[i]} />
    {#if i < hardwares.length - 1}
      <div class="wrapper">
        <div class="first">
          <ActionIcon
            variant="outline"
            color="yellow"
            on:click={() => {
              connections[i] = connections[i] == true ? false : true;
            }}>
            <Icon
              name={connections[i] == true ? "link-2" : "more-horizontal"} direction="e" />
          </ActionIcon>
        </div>
        <div class="second">
          {#if connections[i] != true}
            <hr />
          {/if}
        </div>
      </div>
    {/if}
  {/each}
  <hr />
  <Button
    variant="outline"
    color="yellow"
    radius="xl"
    size="md"
    ripple
    on:click={() => {
      hardwares = [
        ...hardwares,
        new Hardware(
          hardwares.length,
          "default" + hardwares.length,
          0,
          TYPES.fan
        ),
      ];
    }}>+</Button>
  <div class="inline">
    <Button
      variant="outline"
      color="yellow"
      radius="xl"
      size="md"
      ripple
      on:click={save}>Save</Button>
  </div>
  <div class="inline">
    <Button
      class="inline"
      variant="outline"
      color="yellow"
      radius="xl"
      size="md"
      ripple
      on:click={delet}>Delete</Button>
  </div>
</div>

<style>
  .inline {
    display: inline-block;
  }
  .wrapper {
    width: 100%;
    overflow: auto; /* so the size of the wrapper is alway the size of the longest content */
  }
  .first {
    float: left;
    width: 30px;
  }
  .second {
    margin-top: 12px;
  }
</style>
