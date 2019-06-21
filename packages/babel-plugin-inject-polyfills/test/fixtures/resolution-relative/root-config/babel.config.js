module.exports = {
  plugins: [
    [
      "../../../..",
      {
        method: "entry-global",
        providers: ["./dir/babel-polyfill-provider-foo"],
      },
    ],
  ],
};
