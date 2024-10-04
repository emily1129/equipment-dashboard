<template>
  <div class="w-full flex flex-col items-center justify-center space-y-4">
    <h1 class="flex text-3xl font-bold text-slate-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="size-9 mr-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      404 - Page Not Found
    </h1>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <router-link to="/">Go back to homepage</router-link>
  </div>
</template>

<style scoped>
a:hover {
  background-color: rgba(202, 202, 202, 0.6);
  text-decoration: underline;
}
</style>
