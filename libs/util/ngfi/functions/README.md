# @ngfi/functions

Library which packages @iote/cqrs compliant handlers into Google Cloud functions for deployment. Adds context and environment.

Because of this library, developers need not to worry about the complexity of GCF configurations. Furthermore, code developed in the hanlders doesn't even need to be aware of the context in which it's run (in this case GCP).

This makes the fns more reusable.
