# Credential files #

The server does have some API integrations to fetch more information for each video. Some integrations require credentials to authorize the requests. In case credentials are needed you need to create the corresponding credentials JSON and place it in this directory. There are no default credential files since they are on .gitignore.

Find a list of all supported providers, the correct file names and the JSON format for each file below.

## Currently supported providers and file format ##

### YouTube ###

**youtube.json**

```
{
    key: "yourOAuthAPIServerKeyGoesHere"
}
```
