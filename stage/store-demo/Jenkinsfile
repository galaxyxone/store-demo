pipeline {
    agent { label 'nodejs-10-chrome' }
    options {
        timeout(time: 40, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    environment {
        COVERAGE = 'true'
        REPORTER = 'xunit'
        CI = 'true'
    }
    stages {
        stage("Test") {
            steps {
                sh "npm ci"
                sh "npm test"
            }
        }
        stage("Build") {
            when {
                branch null
            }
            steps {
                // Build for nginx binary deploy
                sh "npm run build"
                // Copy nginx default config
                sh 'mkdir -p dist/nginx-default-cfg && cp server-config/nginx.conf "$_"'
                 // Copy nginx start script
                sh 'mkdir -p dist/nginx-start && cp server-config/init-env.sh "$_"'

                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            openshift.selector("bc", env.APP_NAME).startBuild("--from-dir ./dist --wait")
                        }
                    }
                }
            }
        }
        stage("Deploy") {
            when {
                branch null
            }
            steps {
                script {
                  openshift.withCluster() {
                      openshift.withProject() {
                          def rollout = openshift.selector('dc', env.APP_NAME).rollout()
                          rollout.latest()
                          rollout.status("-w")
                      }
                  }
                }
            }
        }
    }
    post {
        always {
            junit 'report.xml'
            step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
        }
    }
}
