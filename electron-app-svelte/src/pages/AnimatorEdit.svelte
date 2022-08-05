<script>
    import { Button, TextInput } from "@svelteuidev/core";

    //TODO : un profile d'animation=> une animation, non rattaché au hardawre
    //Menu generale : Selection du hardware, selection d'une animation pour chaque VHardware du Hardware
    
    import AnimatorComp from "../components/animator.svelte";
    import {LedAnimation} from "../../build/Animations"
  import InputValidate from "../components/InputValidate.svelte";
  var profileID;
  var profileList = [];
  var nameInput;
    var hardwares = [];
    var animations={};

    window.send("animation.profiles");
    window.receive("animation.profiles",(res)=>{
        profileList= res;
        if(profileList.length<=0)
        createProfile();
        else {
        profileID = profileList[0];
    }
    })
    function createProfile() {
    window.send("animation.editProfile", {
      operation: "new",
      name: "myAnimation",
    });
  }
  window.receive("animation.editProfile", (args) => {
    console.log("a")
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
      window.send("animations.editProfile", {
        operation: "rename",
        name: profileID,
        rename: nameInput,
      });
    }
  }
    window.receive("animations.request",(res)=>{
      if(res)
      {
        animations={};
        for(let d in res)
        {
            animations[d]=new LedAnimation("").fromObject(res[d]);
        }
        fillAnimations(hardwares);
      }
        
    })
    function sendTo(hard,pos)
    {
        
   
    window.send("Serial.send",animations[hard.name].setSave(true).getCommand(pos));
    }
    window.receive("Serial.receive",(res)=>{
        console.log(res)
    })
   function fillAnimations(hard)
   {
    for(let k in hard)
        {
            let d= hard[k];
            
            if(!animations[d.name])
            {
                animations[d.name]= new LedAnimation("default"+k);
            }
        }
}
function save(id)
{
    window.send("animation.save",{hardware:id,anim:animations[id]})
}
</script>

<div>
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
    {#each hardwares as hard, i}
    <h2 style="margin-left:10%">{hard.name}</h2>
        <AnimatorComp bind:hardware={hardwares[i]} bind:animation={animations[hard.name]}/>
        
    <Button variant="outline" color="yellow" radius="xl" size="md"ripple on:click={()=>{save(hard.name)}} >Save</Button>
     <Button variant="outline" color="yellow" radius="xl" size="md"ripple on:click={()=>{sendTo(hard,i)}} >Keep</Button>
        {#if i < hardwares.length - 1}
          <hr>
        {/if}
    {/each}
</div>

