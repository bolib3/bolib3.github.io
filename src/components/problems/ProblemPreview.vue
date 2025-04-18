<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@vueuse/core';

// Persist the selected language in local storage
// This will allow the user to switch between languages and have their choice remembered
const chosenLanguage = useLocalStorage('chosenLanguage', 'python');
</script>

<template>
  <Tabs v-model="chosenLanguage">
    <TabsList class="grid grid-cols-5">
      <TabsTrigger value="python"> Python </TabsTrigger>
      <TabsTrigger value="matlab"> MatLab </TabsTrigger>
      <TabsTrigger value="julia"> Julia </TabsTrigger>
      <TabsTrigger value="ampl"> AMPL </TabsTrigger>
      <TabsTrigger value="gams"> GAMS </TabsTrigger>
    </TabsList>
    <TabsContent value="python">
      <slot name="python" class="overflow-x-auto" />
    </TabsContent>
    <TabsContent value="matlab">
      <slot name="matlab" />
    </TabsContent>
    <TabsContent value="julia">
      <slot name="julia" />
    </TabsContent>
    <TabsContent value="ampl">
      <slot name="ampl" />
    </TabsContent>
    <TabsContent value="gams">
      <slot name="gams" />
    </TabsContent>
  </Tabs>
</template>
