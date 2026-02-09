package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "probe",
	Short: "Fast, lightweight API test runner",
	Long:  "Probe runs API tests defined in YAML files and exits with CI-friendly status codes.",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
